# Sms03_Lookup_SendList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `tdm`
- 파일: `client/vi/sms/Sms03_Lookup_SendList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByList` | Sms03_Lookup_SendList:172 | [`Emp00_TransInfo.java:86`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByList`](../../emp/sql/emp00_trans_info.md) |
| `sms.Sms03_GroupSend.sendMessageList` | Sms03_Lookup_SendList:214 | [`Sms03_GroupSend.java:129`](../../sms/services/Sms03_GroupSend.md) | - |

## 테이블

[`emp01_person`](../../../db/tables/emp.md)

## DB 함수

`f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sms03_Lookup_SendList (`client/vi/sms/Sms03_Lookup_SendList.java`, 235줄)

- 툴바 `buttonBar`: {insertButton} {retrieveButton}
- 입력·하위 화면: `message` MyTextArea, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid()):
  - orgTitleName 160 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text
  - actionCell 70 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L68-94) → settings(), show()
[E1] retrieveButton[초기화].Select (L97) → retrieve()
[E2] insertButton[추가].Select [list != null] (L103) → 인라인 L103-133 (new SelectHandler() { @Override publi…)
[E3] sendButton[발송].Select (L134) → sendCheck()
       └ [E5] msgBox.DialogHide [YES] (L183) → sendMessage()
[E4] closeButton[취소].Select (L140) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-66 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L165-178 | E1,open | 서비스 emp.Emp00_TransInfo.selectByList(companyId, personIdList) | 업무 |
| private sendCheck() | L180-199 | E3 | ConfirmBox → E5 | 업무 |
| public sendMessage() | L201-230 | E5 | 서비스 sms.Sms03_GroupSend.sendMessageList(companyId, msg) | 업무 |
| private settings() | L96-146 | 생성자 | 조회창 Emp00_Lookup_SelectMulti 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L148-163 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L232-234 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgTitleNm', 160, '조직'),  // L156
  gb.text('titleNm', 100, '직책'),  // L157
  gb.text('empNo', 80, '사번'),  // L158
  gb.text('korNm', 80, '성명'),  // L159
  // ⚠ 대응 없음 (GridBuilder L160) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* 인라인 L103-133 (new SelectHandler() { @Override publi…) */}>추가</Button>
2. <Button type="reset" onClick={retrieve}>초기화</Button>
3. <Button type="send" onClick={sendCheck}>발송</Button>
4. <Button type="cancel" onClick={hide}>취소</Button>

