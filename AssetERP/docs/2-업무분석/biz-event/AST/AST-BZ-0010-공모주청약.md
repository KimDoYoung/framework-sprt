# AST-BZ-0010 운용담당이 공모주를 청약하고 환불·입고를 처리한다

> **한 줄 요약** — 회사가 공모주(·채권·유상증자)를 청약하면 운용담당이 #1288 청약처리에서 차례로 거래를 넣는다. **청약**(3501 — 청약금을 증권계좌로 납입: 차 청약예치금·수수료 / 대 보통예금) → 배정 뒤 **청약금환불**(3502 — 배정받지 못한 금액: 차 보통예금 / 대 청약예치금) → **청약입고**(3503 — 배정 주식이 들어옴: 차 주식(자산) / 대 청약예치금, 상장일·보유의무확약·매도제한일). 입고하면 보유원장에 주식이 생겨 #1160 보유내역에 나온다. 종목이 없으면 청약 창의 [종목 생성]이 "IPO 자동생성 지정" 폴더 아래에 새 종목을 만든다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용(kalpa 과장 301) |
| 언제 | 청약일·환불일·상장 전 |
| 먼저 있어야 하는 것 | AST-BZ-0002(보관계좌·출금계좌, **IPO 자동생성 지정 폴더**), AST-BZ-0001 + **#1288 화면별 거래유형**(회사 0 기초에 없음), ACT 분개맵핑 |
| 다음 이벤트 | AST-BZ-0008(상장 뒤 매도), AST-BZ-0009(평가) |
| 실제 실행 | kalpa, 2026-11-12, API. ① #1288 거래유형 조회창 0행 → KFS가 화면별 거래유형 7개(3500·3501·3502·3503·3504·3510·3511, 회사 28000과 같게)를 넣음. ② [종목 생성](`POST /ast/class-trees/ipo`) → "IPO생성 지정 된 자산디렉토리가 존재하지 않습니다" — TOBE에서 지정할 방법이 없어(의심 #113) [가져오기]로 들어온 `공모주12`로 진행. ③ 청약 2026-11-05 200주 × 20,000 + 수수료 2,000 = 4,002,000 → 환불 2026-11-10 150주 3,000,000 → 입고 2026-11-12 50주 1,000,000(상장일 11-20, 미확약 `00`) → 보유 `공모주12` 50주·장부 1,000,000. 목록 AS-IS 3 = 3. ④ **입고 분개의 차변이 `당기손익-공정가치측정증권처분이익_주식`**(자산이어야 함 — 회사 0 실계정맵 오류, 의심 #114) |
| 메뉴 | #1288 고유자산 > 20. 고유자산 거래처리 > 청약처리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 운용 | #1288 | 거래유형 → 공모주청약 → [등록] → 종목(없으면 [종목 생성]) → 보관계좌·출금계좌 → 청약수량·공모단가(청약금액 = 수량 × 단가 ÷ 거래단위)·수수료 → [저장] | 분개 자동 생성 |
| 2 | 〃 | 〃 | 청약금환불 → 환불 수량·금액 → [저장] | 청약예치금 감소 |
| 3 | 〃 | 〃 | 청약입고 → 배정 수량·단가·상장일·보유의무확약(미확약이 아니면 매도제한일) → [저장] | 보유원장에 주식 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast15_tr_code_window` | kalpa `Ast06_Tab_TrIPO` 7줄 | +7 |
| `ast06_tr`·`ast08_tr_finance` | 청약(3501)·환불(3502)·입고(3503) | +3·+3 |
| `ast09_book` | `공모주12` 50주 | +1 |
| `act02`·`act06`·`act03` | 전표 3건 | +3 |

## 업무 규칙 · 주의

- 입고(3503)·기관공모주청약(3500)·채권청약입고(3511)는 상장일 필수, 보유의무확약이 미확약(`00`)이 아니면 매도제한일 필수.
- ⚠ **[종목 생성]이 새 회사에서 안 된다(TOBE만)**: "IPO 자동생성 지정" 폴더가 필요한데, TOBE는 ① [가져오기] 복사(`insertCopy`)에 `ast01_ipo_assign_yn`이 빠졌고 ② 분류 편집(`updateClassTree`·`AstClassTreeSaveReq`)·화면에 그 체크박스("IPO 자동생성 지정", 원본 `Ast01_Edit_ClassTree` L68·L154)가 없다 → [의심 #113](../../보안_및_버그_의심.md).
- ⚠ 회사 0 기초 데이터: 화면별 거래유형이 빠진 화면이 10개다(#1288·#1196 외 `Ast06_Tab_Tr4Insure`·`TrAcntTransfer`·`TrDepositInt`·`TrForFinance`·`TrForIntrinsic`·`Ast13_Tab_OfficeAssets`·`Pay50_Tab_Expense`·`Pay50_Tab_ExpenseSettle`) → [의심 #110](../../보안_및_버그_의심.md). 그리고 실계정맵의 자산계정(1100)·상장주식(`2010111000`)이 처분이익 계정으로 이어져 입고 분개가 틀린다 → [의심 #114](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0010
needs: [AST-BZ-0002]
steps:
  - no: 0
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ast/tr-code-windows
    body: { companyId: <kalpa>, className: Ast06_Tab_TrIPO, items: [3500, 3501, 3502, 3503, 3504, 3510, 3511] }
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ast/trs/finance, POST /api/v1/act/journals/create]   # 세 번: 3501 · 3502 · 3503
    body: [{ date: "2026-11-05", trCode: "3501", astClassTreeId: <공모주12>, corpId: <미래에셋 거래처>, accountId: <미래에셋증권163>, depositId: <우리은행>, qty: 200, price: 20000, trAmt: 4000000, fee: 2000, amt: 4002000 },
           { date: "2026-11-10", trCode: "3502", qty: 150, trAmt: 3000000, amt: 3000000, … },
           { date: "2026-11-12", trCode: "3503", settleMngYn: true, qty: 50, price: 20000, trAmt: 1000000, lockUpPeriodCode: "00", listDate: "2026-11-20", … }]
  - no: 2
    api: GET /api/v1/ast/books/finance?holdDate=2026-11-12
    expect: { row: { astClassTreeName: 공모주12, holdQty: 50, bookAmt: 1000000 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast06_Tab_TrIPO`(#1288 E0~E10), `Ast06_Lookup_TrIPO`(preUpdate L720-783, update L785-806, setTrAmt L550-566), `Ast06_Lookup_CreateIpoAstClass` → `Ast01_ClassTree.insertIpo` L272(`selectIpoAssignClassTreeId`), `Ast01_Edit_ClassTree`(ipoAssignYn L68·L105·L154), 매퍼 `ast01_class_tree.insert`(ipo_assign_yn 포함).
- TOBE: `PUT /api/v1/ast/trs/finance`, `POST /api/v1/ast/class-trees/ipo`, `AstClassTreeMapper.xml` `insertCopy` L367-381·`updateClassTree` L506-515(ipo 없음).
</details>
