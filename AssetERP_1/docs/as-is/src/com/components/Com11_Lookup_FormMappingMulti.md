# Com11_Lookup_FormMappingMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `est`
- 파일: `client/vi/com/Com11_Lookup_FormMappingMulti.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Pay06_Popup_Example`](../../pay/components/Pay06_Popup_Example.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com11_FormMappingMulti.modelUpdate` | Com11_Lookup_FormMappingMulti:178 | [`Com11_FormMappingMulti.java:89`](../../com/services/Com11_FormMappingMulti.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com11_form_mapping_multi)` 동적 INSERT/UPDATE → [`com11_form_mapping_multi.selectById`](../../com/sql/com11_form_mapping_multi.md) |

## 테이블

[`com11_form_mapping_multi`](../../../db/tables/com.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Com11_Lookup_FormMappingMulti (`client/vi/com/Com11_Lookup_FormMappingMulti.java`, 207줄)

- 입력·하위 화면: `content` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L91-130) → 초기화
[E1] updateButton[저장].Select (L108) → update()
[E2] closeButton[닫기].Select (L114) → hide()
[E3] referenceLabel.Click (L120) → 인라인 L120-125 (new ClickHandler() { @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L67-89 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L132-167 | open | 상태 처리 | 업무 |
| public update() | L169-188 | E1 | 서비스 com.Com11_FormMappingMulti.modelUpdate | 업무 |
| private setHtmlStyle() | L200-202 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L204-206 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

