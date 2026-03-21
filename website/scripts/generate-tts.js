#!/usr/bin/env node
/**
 * FCE TTS Audio Generator
 * Reads YAML content and generates mp3 files using OpenAI TTS API.
 *
 * Usage:
 *   source ~/.zprofile && node scripts/generate-tts.js [type] [range]
 *
 * Examples:
 *   node scripts/generate-tts.js vocab V0301-V0450     # Generate vocab pronunciation
 *   node scripts/generate-tts.js listening L136-L200    # Generate listening audio
 *   node scripts/generate-tts.js vocab all              # Generate all missing vocab
 *   node scripts/generate-tts.js listening all          # Generate all missing listening
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const yaml = require('js-yaml');

const API_KEY = process.env.OPENAI_VOICE_GEN;
if (!API_KEY) {
  console.error('Error: OPENAI_VOICE_GEN not set. Run: source ~/.zprofile');
  process.exit(1);
}

const BASE = path.join(__dirname, '..', 'src', 'data', 'english', 'fce');
const AUDIO_BASE = path.join(__dirname, '..', 'public', 'audio', 'english', 'fce');

// Voice assignments for different speaker types
const VOICES = {
  default: 'alloy',     // Neutral, clear — good for vocab and narration
  male: 'echo',         // Male voice
  female: 'nova',       // Female voice, natural
  child: 'shimmer',     // Lighter voice for younger speakers
  narrator: 'onyx',     // Deep, authoritative — good for guides/teachers
  guide: 'fable',       // British-sounding, warm
};

// Rate limiting: max 3 concurrent requests
const MAX_CONCURRENT = 3;
const DELAY_MS = 500; // 500ms between batches

async function callTTS(text, voice = 'alloy', outputPath) {
  if (fs.existsSync(outputPath)) {
    return 'skip'; // Already exists
  }

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const { execSync } = require('child_process');
  const escapedText = text.replace(/'/g, "'\\''").replace(/\n/g, ' ');
  const cmd = `curl -s -o '${outputPath}' -w '%{http_code}' ` +
    `https://api.openai.com/v1/audio/speech ` +
    `-H 'Authorization: Bearer ${API_KEY}' ` +
    `-H 'Content-Type: application/json' ` +
    `-d '{"model":"tts-1","input":"${escapedText.replace(/"/g, '\\"')}","voice":"${voice}"}'`;

  try {
    const statusCode = execSync(cmd, { encoding: 'utf8', timeout: 60000 }).trim();
    if (statusCode === '200' && fs.existsSync(outputPath)) {
      return 'ok';
    } else {
      throw new Error(`HTTP ${statusCode}`);
    }
  } catch (e) {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    throw new Error(e.message.slice(0, 100));
  }
}

async function runBatch(tasks) {
  let done = 0, skipped = 0, failed = 0;

  for (let i = 0; i < tasks.length; i += MAX_CONCURRENT) {
    const batch = tasks.slice(i, i + MAX_CONCURRENT);
    const results = await Promise.allSettled(
      batch.map(t => callTTS(t.text, t.voice, t.output))
    );

    results.forEach((r, j) => {
      const t = batch[j];
      if (r.status === 'fulfilled') {
        if (r.value === 'skip') {
          skipped++;
        } else {
          done++;
          process.stdout.write(`\r  Generated: ${done} | Skipped: ${skipped} | Failed: ${failed} | Total: ${tasks.length}`);
        }
      } else {
        failed++;
        console.error(`\n  ✗ ${t.id}: ${r.reason.message}`);
      }
    });

    if (i + MAX_CONCURRENT < tasks.length) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n  Done: ${done} generated, ${skipped} skipped, ${failed} failed`);
}

// ===== VOCAB: Generate word pronunciation =====
async function generateVocab(rangeStr) {
  console.log('\n📖 Generating vocabulary pronunciation...');

  const vocabFiles = fs.readdirSync(path.join(BASE, 'vocab'))
    .filter(f => f.startsWith('topic-') && f.endsWith('.yaml'));

  const tasks = [];
  const outputDir = path.join(AUDIO_BASE, 'vocab');

  let [rangeStart, rangeEnd] = [0, 99999];
  if (rangeStr && rangeStr !== 'all') {
    const [s, e] = rangeStr.split('-');
    rangeStart = parseInt(s.replace('V', ''));
    rangeEnd = parseInt(e.replace('V', ''));
  }

  for (const file of vocabFiles) {
    const data = yaml.load(fs.readFileSync(path.join(BASE, 'vocab', file), 'utf8'));
    const vocabList = data.vocab || data.vocabularyList || [];

    for (const entry of vocabList) {
      const num = parseInt(entry.id.replace('V', ''));
      if (num < rangeStart || num > rangeEnd) continue;

      const outputPath = path.join(outputDir, `${entry.id}.mp3`);
      tasks.push({
        id: entry.id,
        text: entry.word,
        voice: 'alloy',
        output: outputPath,
      });
    }
  }

  console.log(`  Found ${tasks.length} vocab items in range`);
  await runBatch(tasks);
}

// ===== LISTENING: Generate listening audio =====
async function generateListening(rangeStr) {
  console.log('\n🎧 Generating listening audio...');

  const listeningFiles = fs.readdirSync(path.join(BASE, 'listening'))
    .filter(f => f.endsWith('.yaml'));

  const tasks = [];
  const outputDir = path.join(AUDIO_BASE, 'listening');

  let [rangeStart, rangeEnd] = [0, 99999];
  if (rangeStr && rangeStr !== 'all') {
    const [s, e] = rangeStr.split('-');
    rangeStart = parseInt(s.replace('L', ''));
    rangeEnd = parseInt(e.replace('L', ''));
  }

  for (const file of listeningFiles) {
    const data = yaml.load(fs.readFileSync(path.join(BASE, 'listening', file), 'utf8'));
    const extracts = data.extracts || [];

    for (const extract of extracts) {
      const num = parseInt(extract.id.replace('L', ''));
      if (num < rangeStart || num > rangeEnd) continue;

      const outputPath = path.join(outputDir, `${extract.id}.mp3`);

      // Build full script text from all speakers
      let fullText = '';
      if (extract.type === 'short-extract') {
        // Single script array
        const scripts = extract.script || [];
        fullText = scripts.map(s => s.text).join('\n\n');
      } else if (extract.type === 'sentence-completion') {
        // Long monologue
        const scripts = extract.script || [];
        fullText = scripts.map(s => s.text).join('\n\n');
      } else if (extract.type === 'multiple-matching') {
        // Multiple speakers — generate one combined file
        const speakers = extract.speakers || [];
        fullText = speakers.map((s, i) => `Speaker ${i + 1}. ${s.text}`).join('\n\n');
      }

      if (!fullText.trim()) continue;

      // Choose voice based on speaker types
      let voice = 'alloy';
      if (extract.script && extract.script.length > 0) {
        const v = extract.script[0].voice;
        if (v && VOICES[v]) voice = VOICES[v];
      }

      tasks.push({
        id: extract.id,
        text: fullText,
        voice: voice,
        output: outputPath,
      });
    }
  }

  console.log(`  Found ${tasks.length} listening items in range`);
  await runBatch(tasks);
}

// ===== MAIN =====
async function main() {
  const [,, type, range] = process.argv;

  if (!type) {
    console.log('Usage: node scripts/generate-tts.js [vocab|listening|all] [range|all]');
    console.log('Examples:');
    console.log('  node scripts/generate-tts.js vocab V0301-V0450');
    console.log('  node scripts/generate-tts.js listening L136-L200');
    console.log('  node scripts/generate-tts.js all');
    process.exit(0);
  }

  if (type === 'vocab' || type === 'all') {
    await generateVocab(range || 'all');
  }
  if (type === 'listening' || type === 'all') {
    await generateListening(range || 'all');
  }

  console.log('\n✅ All done!');
}

main().catch(e => { console.error(e); process.exit(1); });
