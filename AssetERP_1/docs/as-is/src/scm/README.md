# 도메인: scm

화면 6개, 컴포넌트 0개, 서버 클래스 8개, 매퍼 8개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Scm01_Tab_DevMng`](screens/Scm01_Tab_DevMng.md) | KFS > 01. 시스템 개발 > 시스템 개발 관리 | 16 | 24 |
| [`Scm01_Tab_Sr`](screens/Scm01_Tab_Sr.md) | KFS > 01. 시스템 개발 > 시스템 개발 의뢰 | 8 | 10 |
| [`Scm10_Tab_Dev`](screens/Scm10_Tab_Dev.md) | KFS > 01. 시스템 개발 > 시스템 개발 | 14 | 17 |
| [`Scm11_Tab_DevTest`](screens/Scm11_Tab_DevTest.md) | KFS > 01. 시스템 개발 > 시스템 QA/UAT | 9 | 11 |
| [`Scm13_Tab_Deploy`](screens/Scm13_Tab_Deploy.md) | KFS > 02. 배포관리 > 배포처리 | 9 | 13 |
| [`Scm30_Tab_Program`](screens/Scm30_Tab_Program.md) | KFS > 03. 프로그램 관리 > 프로그램 관리 | 4 | 4 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`scm.Scm01_Sr`](../scm/services/Scm01_Sr.md) | 8 |
| [`scm.Scm02_SrApprStep`](../scm/services/Scm02_SrApprStep.md) | 6 |
| [`scm.Scm03_ExpectProgram`](../scm/services/Scm03_ExpectProgram.md) | 4 |
| [`scm.Scm10_Dev`](../scm/services/Scm10_Dev.md) | 6 |
| [`scm.Scm11_DevStep`](../scm/services/Scm11_DevStep.md) | 14 |
| [`scm.Scm12_DevStepRule`](../scm/services/Scm12_DevStepRule.md) | 5 |
| [`scm.Scm13_DevProgram`](../scm/services/Scm13_DevProgram.md) | 9 |
| [`scm.Scm30_Program`](../scm/services/Scm30_Program.md) | 10 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`scm01_sr`](sql/scm01_sr.md) | 8 |
| [`scm02_sr_appr_step`](sql/scm02_sr_appr_step.md) | 4 |
| [`scm03_expect_program`](sql/scm03_expect_program.md) | 2 |
| [`scm10_dev`](sql/scm10_dev.md) | 4 |
| [`scm11_dev_step`](sql/scm11_dev_step.md) | 14 |
| [`scm12_dev_step_rule`](sql/scm12_dev_step_rule.md) | 2 |
| [`scm13_dev_program`](sql/scm13_dev_program.md) | 6 |
| [`scm30_program`](sql/scm30_program.md) | 13 |

