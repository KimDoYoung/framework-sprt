# SFD02 FileDownload `monitoring` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `monitoringImage L191 → downloadGenericImage`. TOBE: (없음) — `getImage`로 부를 수는 있으나 기본 이미지가 다르다 |
| 2026-11-04 | 결과 | **대기(프레임 결정 필요).** `image`와 같은 로직이고 **기본 이미지만 `noimage.jpg`**(image는 `nonamed.jpg`). 호출은 `MainFrame.getNorthLayout()` L538 상단 오른쪽 프로필 사진(35×35 원형, `parentId`=로그인 사원)과 `Monitoring_Page_Emp` L166(이 화면은 변환 목록에 없음) |
| 2026-11-04 | 참고 | TOBE 프레임 `TopBar.tsx` L469는 `Avatar icon={<UserOutlined/>}`로 사진을 안 쓴다. TopBar는 OMS에서 가져온 기반(B04~B08)이라 AS-IS처럼 사진을 보일지는 **사용자 결정**이 필요하다(사진을 쓰려면 `getImage`에 기본 이미지 구분이 필요 — 예: `noimage.jpg` 선택 파라미터). 결정 전 코드 변경 없음 |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
