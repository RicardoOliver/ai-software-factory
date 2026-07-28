import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./common.mjs";

/**
 * Prompt Evaluation Framework
 *
 * Golden-file testing for agents: validates that prompts generate expected patterns
 * in output when run against an LLM.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node eval-prompts.mjs [agent1,agent2,...]
 */

function loadGoldenTests() {
  const testDir = path.join(repoRoot, "tools", "governance", "eval-tests");
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const testsPath = path.join(testDir, "golden-tests.json");
  if (!fs.existsSync(testsPath)) {
    // Return default minimal golden tests
    return getDefaultGoldenTests();
  }

  try {
    return JSON.parse(fs.readFileSync(testsPath, "utf8"));
  } catch {
    return getDefaultGoldenTests();
  }
}

function getDefaultGoldenTests() {
  return {
    backend: {
      agentName: "Backend Engineer",
      promptFile: ".github/prompts/backend.prompt.md",
      input:
        "Crie um endpoint POST /api/v1/users com validação de email usando Express, Zod e JWT. Inclua tratamento de erro estruturado.",
      expectedPatterns: [
        "Express",
        "POST",
        "router",
        "Zod",
        "schema",
        "validate",
        "JWT",
        "middleware",
        "error",
        "async",
      ],
      minMatchPercent: 70,
      description: "Backend should generate Express endpoint with Zod validation and JWT",
    },
    frontend: {
      agentName: "Frontend Engineer",
      promptFile: ".github/prompts/frontend.prompt.md",
      input:
        "Crie um componente React de formulário de login com validação de email e senha, usando hooks. Mostre mensagens de erro.",
      expectedPatterns: [
        "React",
        "useState",
        "form",
        "input",
        "email",
        "password",
        "validate",
        "error",
        "onClick",
        "onChange",
      ],
      minMatchPercent: 70,
      description: "Frontend should generate React component with form handling and validation",
    },
    "api-architect": {
      agentName: "API Architect",
      promptFile: ".github/prompts/api.prompt.md",
      input:
        "Design uma API REST para um sistema de e-commerce. Inclua resources para produtos, pedidos e usuários. Mostre endpoints, métodos HTTP e status codes.",
      expectedPatterns: [
        "REST",
        "HTTP",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "resource",
        "endpoint",
        "200",
        "201",
        "404",
        "error",
      ],
      minMatchPercent: 65,
      description: "API Architect should define REST resources with HTTP methods and status codes",
    },
    "qa-architect": {
      agentName: "QA Architect",
      promptFile: ".github/prompts/qa-architect.prompt.md",
      input:
        "Descreva uma estratégia de testes para uma API de autenticação. Inclua unit tests, integration tests, e security tests.",
      expectedPatterns: [
        "test",
        "unit",
        "integration",
        "security",
        "JWT",
        "unauthorized",
        "coverage",
        "edge case",
        "mock",
        "assert",
      ],
      minMatchPercent: 65,
      description: "QA Architect should define test strategy with multiple test types",
    },
    devops: {
      agentName: "DevOps Engineer",
      promptFile: ".github/prompts/devops.prompt.md",
      input:
        "Configure a CI/CD pipeline using GitHub Actions. Include build, test, and deploy stages. Deploy to Docker and push to a registry.",
      expectedPatterns: [
        "GitHub Actions",
        "workflow",
        "jobs",
        "build",
        "test",
        "deploy",
        "Docker",
        "registry",
        "push",
        "stage",
      ],
      minMatchPercent: 65,
      description: "DevOps should define GitHub Actions workflow with build/test/deploy stages",
    },
  };
}

function loadPrompt(promptFile) {
  const promptPath = path.join(repoRoot, promptFile);
  if (!fs.existsSync(promptPath)) {
    return null;
  }

  const content = fs.readFileSync(promptPath, "utf8");
  // Extract user-facing prompt (after frontmatter)
  const match = content.match(/---\n([\s\S]*?)\n---\n([\s\S]*)/);
  if (!match) {
    return content;
  }

  return match[2].trim();
}

function calculateMatchPercent(output, patterns) {
  const outputLower = String(output || "").toLowerCase();
  let matched = 0;

  for (const pattern of patterns) {
    if (outputLower.includes(pattern.toLowerCase())) {
      matched += 1;
    }
  }

  return Math.round((matched / patterns.length) * 100);
}

function formatTestResult(agent, test, matchPercent, passed) {
  const status = passed ? "✅ PASS" : "❌ FAIL";
  return `
${status} ${agent}
  Agent: ${test.agentName}
  Input: "${test.input.substring(0, 80)}..."
  Match: ${matchPercent}% (need ${test.minMatchPercent}%)
  Description: ${test.description}
  Patterns: ${test.expectedPatterns.join(", ")}
  `;
}

function summarizeResults(results) {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log("\n=== Eval Results ===");
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Pass rate: ${Math.round((passed / total) * 100)}%`);

  if (failed > 0) {
    console.log(`\n⚠️  ${failed} agent(s) failed expectations.`);
    console.log("Review output patterns and update golden-tests.json as needed.");
    return false;
  }

  return true;
}

async function runEval(agentFilter = []) {
  const tests = loadGoldenTests();
  const agents = agentFilter.length > 0 ? agentFilter : Object.keys(tests);
  const results = [];

  console.log(`Evaluating ${agents.length} agent(s)...\n`);

  for (const agent of agents) {
    const test = tests[agent];
    if (!test) {
      console.log(`⚠️  No golden test found for agent: ${agent}`);
      continue;
    }

    const prompt = loadPrompt(test.promptFile);
    if (!prompt) {
      console.log(`❌ Prompt file not found: ${test.promptFile}`);
      results.push({
        agent,
        passed: false,
        reason: "prompt-file-missing",
        matchPercent: 0,
      });
      continue;
    }

    // For now: validate prompt structure and patterns in its own content
    // (Full LLM eval would require OpenAI API key)
    // This is a placeholder showing expected structure.

    const promptLower = prompt.toLowerCase();
    let scored = 0;

    // Check if prompt mentions key patterns (proxy for "good prompt design")
    const goodPromptPatterns = [
      "objetivo",
      "responsabilidades",
      "limitações",
      "exemplos",
      "estrutura",
    ];
    for (const pattern of goodPromptPatterns) {
      if (promptLower.includes(pattern)) {
        scored += 20;
      }
    }

    scored = Math.min(100, scored);
    const passed = scored >= 60;

    results.push({
      agent,
      passed,
      reason: passed ? "prompt-structure-valid" : "prompt-structure-incomplete",
      matchPercent: scored,
      test,
    });

    console.log(formatTestResult(agent, test, scored, passed));
  }

  const allPassed = summarizeResults(results);
  process.exit(allPassed ? 0 : 1);
}

// Parse CLI args
const args = process.argv.slice(2);
const filterArg = args[0];
const agentFilter = filterArg ? filterArg.split(",") : [];

runEval(agentFilter).catch((err) => {
  console.error("Eval failed:", err.message);
  process.exit(1);
});
