// code-health 용 ESLint 설정(flat config). frontend/ 에는 설정·의존성을 두지 않는다.
// 실행은 tools/code-health.sh --front (또는 --only eslint). 규칙 등급은 report.py 의 RULE_GRADE.
// 타입 정보가 필요 없는 규칙만 쓴다(빠르고 tsconfig 에 안 묶임) — 타입 오류는 tsc 가 잡는다.
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["**/dist/**", "**/node_modules/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: { globals: { ...globals.browser } },
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // 안 쓰는 변수·import. 앞에 _ 를 붙이면 의도적으로 안 쓰는 것
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            // recommended 는 error 인데 error 는 보고서에서 '우선 높음'이 된다 — 실제 버그(rules-of-hooks 등)만 error 로 둔다
            "@typescript-eslint/no-explicit-any": "warn",
            "no-empty": ["warn", { allowEmptyCatch: true }],
            "prefer-const": "warn",
            "eqeqeq": ["warn", "smart"],
        },
    },
);
