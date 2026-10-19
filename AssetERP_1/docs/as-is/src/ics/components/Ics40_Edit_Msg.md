# Ics40_Edit_Msg

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/ics/Ics40_Edit_Msg.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics40_DcrPreconfirm.modelUpdate` | Ics40_Edit_Msg:134 | [`Ics40_DcrPreconfirm.java:132`](../../ics/services/Ics40_DcrPreconfirm.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics40_dcr_preconfirm)` 동적 INSERT/UPDATE → [`ics40_dcr_preconfirm.selectById`](../../ics/sql/ics40_dcr_preconfirm.md) |

## 테이블

[`ics40_dcr_preconfirm`](../../../db/tables/ics.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics40_Edit_Msg (`client/vi/ics/Ics40_Edit_Msg.java`, 154줄)

- 입력·하위 화면: `confirmMsg` MyTextArea, `regEmpMsg` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L78-91) → settings(), show()
[E1] updateButton[저장].Select (L94) → update()
[E2] closeButton[닫기].Select [callback != null] (L100) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editRegEmpMsg() | L43-52 | 공개 메서드 | 상태 처리 | 업무 |
| public editConfirmMsg() | L54-63 | 공개 메서드 | 상태 처리 | 업무 |
| public show() | L65-76 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L111-129 | editRegEmpMsg,editConfirmMsg,show | 상태 처리 | 업무 |
| public update() | L131-145 | E1 | 서비스 ics.Ics40_DcrPreconfirm.modelUpdate | 업무 |
| private settings() | L93-109 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L147-149 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L151-153 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

