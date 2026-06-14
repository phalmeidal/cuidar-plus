import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';

const compose = yaml.load(await readFile('docker-compose.yml', 'utf8'));
const requiredServices = ['db', 'api', 'web'];
const errors = [];

for (const serviceName of requiredServices) {
  const service = compose?.services?.[serviceName];
  if (!service) {
    errors.push(`Missing required service: ${serviceName}`);
    continue;
  }
  if (!service.healthcheck) {
    errors.push(`Missing healthcheck for service: ${serviceName}`);
  }
}

if (!Object.hasOwn(compose?.volumes || {}, 'cuidar_plus_db')) {
  errors.push('Missing named volume: cuidar_plus_db');
}

if (!compose?.services?.api?.depends_on?.db) {
  errors.push('API must depend on the database service.');
}

if (!compose?.services?.web?.depends_on?.api) {
  errors.push('Web must depend on the API service.');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('docker-compose.yml syntax and required structure are valid.');
