#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const expected = realpathSync(fileURLToPath(new URL('..', import.meta.url)));
const directory = realpathSync(process.argv[2] || expected);
if (directory !== expected) throw new Error('La ruta debe ser la carpeta de esta web.');
const run = (cmd, args, capture = false) => execFileSync(cmd, args, { cwd: directory, stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8' });
const remote = run('git', ['remote', 'get-url', 'origin'], true).trim();
if (!['https://github.com/JaviPerez07/oddwin.git', 'git@github.com:JaviPerez07/oddwin.git'].includes(remote)) throw new Error('El repositorio de destino no es JaviPerez07/oddwin.');
if (run('git', ['branch', '--show-current'], true).trim() !== 'main') throw new Error('Usa la rama main para publicar.');
run('npm', ['run', 'typecheck']);
run('npm', ['run', 'build']);
run('git', ['add', '-A']);
if (run('git', ['diff', '--cached', '--name-only'], true).trim()) {
  run('git', ['commit', '-m', process.argv[3] || 'Actualizar la web de Oddwin Studios']);
}
run('git', ['push', '-u', 'origin', 'main']);
console.log('Código guardado en GitHub. Cloudflare compila y despliega automáticamente el push a main.');
