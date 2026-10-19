# Sys85_Lookup_ClientInfoList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sms`
- 파일: `client/vi/sys/Sys85_Lookup_ClientInfoList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys85_ClientInfo.delete` | Sys85_Lookup_ClientInfoList:175 | [`Sys85_ClientInfo.java:37`](../../sys/services/Sys85_ClientInfo.md) | `UpdateDataModel(sys85_client_info)` 동적 DELETE |
| `sys.Sys85_ClientInfo.selectByText` | Sys85_Lookup_ClientInfoList:152 | [`Sys85_ClientInfo.java:24`](../../sys/services/Sys85_ClientInfo.md) | [`sys85_client_info.selectByText`](../../sys/sql/sys85_client_info.md) |
| `sys.Sys85_ClientInfo.update` | Sys85_Lookup_ClientInfoList:169 | [`Sys85_ClientInfo.java:32`](../../sys/services/Sys85_ClientInfo.md) | `UpdateDataModel(sys85_client_info)` 동적 INSERT/UPDATE → [`sys85_client_info.selectById`](../../sys/sql/sys85_client_info.md) |

## 테이블

[`sys85_client_info`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys85_Lookup_ClientInfoList (`client/vi/sys/Sys85_Lookup_ClientInfoList.java`, 189줄)

- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton} {updateButton} {insertButton} {deleteButton} ※  '가나다' 순으로 정렬:
- 입력·하위 화면: `searchTextField` TextField 빈칸="고객사/부서명/직위/사원명/휴대폰/비고"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 250 "고객사" Text 편집:TextField
  - orgName 180 "부서명" Text 편집:TextField
  - posName 100 "직위" Text 편집:TextField
  - clientName 100 "사원명" Text 편집:TextField
  - moblieTelno 120 "휴대폰" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L55-86) → settings(), show(), retrieve()
[E1] retrieveButton[조회].Select (L91) → retrieve()
[E2] updateButton[저장].Select (L97) → update()
[E3] insertButton[등록].Select (L103) → insert()
[E4] deleteButton[삭제].Select (L109) → delete()
[E5] confirmButton[확인].Select [선택>0] (L115) → hide()
[E6] closeButton[닫기].Select (L127) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-53 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L147-158 | 생성자,E1 | 서비스 sys.Sys85_ClientInfo.selectByText(searchText) | 업무 |
| private insert() | L160-165 | E3 | 상태 처리 | 업무 |
| public update() | L167-170 | E2 | 서비스 sys.Sys85_ClientInfo.update | 업무 |
| private delete() | L172-176 | E4 | GridDeleteData sys.Sys85_ClientInfo.delete(체크된 행 목록) | 업무 |
| private settings() | L88-133 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L135-145 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L182-184 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 250, '고객사', { editor: 'text' }),  // L139
  gb.text('orgNm', 180, '부서명', { editor: 'text' }),  // L140
  gb.text('posNm', 100, '직위', { editor: 'text' }),  // L141
  gb.text('clientNm', 100, '사원명', { editor: 'text' }),  // L142
  gb.text('moblieTelno', 120, '휴대폰', { editor: 'text' }),  // L143
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insert}>등록</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="save" onClick={hide}>확인</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

