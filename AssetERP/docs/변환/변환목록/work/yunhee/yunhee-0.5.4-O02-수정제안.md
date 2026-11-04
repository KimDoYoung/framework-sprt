# yunhee 0.5.4 수정 제안 (O02, 2026-10-26)

## 1. `getButtonBar().add(button)`로 붙는 창 단추를 "도달 불가"로 표시한다

- **증상**: `yunhee analysis screen Sch01_Tab_List --class Sch10_Lookup_Ipo`가 `[E1] closeButton[닫기].Select … ⚠ 도달 불가 (closeButton 컬럼·툴바 미연결)`로 표시하고, "사용된 버튼들"에도 `type="unknown"`으로 나온다. 실제로는 `init()`(L58-74)에서 `this.getButtonBar().add(closeButton)`으로 창 아래 버튼 줄에 붙어 화면에 보인다.
- **재현**: `yunhee analysis screen Sch01_Tab_List --class Sch10_Lookup_Ipo` (원본 `client/vi/sch/Sch10_Lookup_Ipo.java`)
- **기대**: 창(Window/Dialog)의 `getButtonBar().add(x)`·`addButton(x)`도 "화면에 붙음"으로 본다. 같은 창의 `Sch01_Lookup_InfoView`는 `addButton(closeButton)`이라 정상으로 나오므로, **`getButtonBar().add(…)` 형태만** 빠진 것으로 보인다.
- **영향**: 도달 불가로 표시된 이벤트를 "생략 가능"으로 읽으면 [닫기] 같은 버튼을 빠뜨린다. 이번에는 원문(`method init -o code`)으로 확인해 막았다.
- **같은 한계 기록**: 05 §7의 N22·N23 항목("`getButtonBar().add(…)` 창 단추를 도달 불가로 표시") — 세 번째 확인.
- **연관**: `analysis ui --tobe` 버튼 수도 이 판정을 따르면 AS-IS 쪽 버튼 수가 1 적게 나올 수 있다(O02는 1/1로 맞았음 — 버튼 수는 영향 없음, 이벤트 표시만 문제).

## 2. `mapper-run`/`analysis sql`에 null 파라미터를 줄 수 없다

- `-p classId=` → 빈 글자 `''`로 바인딩되어 `COALESCE('',1)`에서 `invalid input syntax for type integer` 오류.
- **제안**: `-p k=null`(또는 `k=s:`과 구분되는 `k=nil`)을 SQL NULL로. `n:`/`s:` 접두사와 같은 방식으로 `null:` 한 가지 추가도 가능.
