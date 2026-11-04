# SFD02 FileDownload `monitoring` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 대조 | 원본 `monitoringImage L191 → downloadGenericImage`. TOBE: (없음) — `getImage`로 부를 수는 있으나 기본 이미지가 다르다 |
| 2026-11-04 | 결과 | **완료(사용자 결정 2026-11-04).** `image`와 같은 로직이고 **기본 이미지만 `noimage.jpg`**(image는 `nonamed.jpg`). 호출은 `MainFrame.getNorthLayout()` L538 상단 오른쪽 프로필 사진(35×35 원형, `parentId`=로그인 사원)과 `Monitoring_Page_Emp` L166(이 화면은 변환 목록에 없음) |
| 2026-11-04 | 참고 | TOBE 프레임 `TopBar.tsx` L469는 `Avatar icon={<UserOutlined/>}`로 사진을 안 쓴다. TopBar는 OMS에서 가져온 기반(B04~B08)이라 AS-IS처럼 사진을 보일지는 **사용자 결정**이 필요하다(사진을 쓰려면 `getImage`에 기본 이미지 구분이 필요 — 예: `noimage.jpg` 선택 파라미터). 결정 전 코드 변경 없음 |
| 2026-11-04 | 결정·구현 | 사용자 결정(2026-11-04): TopBar에 사진을 넣는다. 백엔드 `GET /api/v1/sys/files/monitoring?parentId=` (`SysFileController.getMonitoringImage` → `SysFileService.getMonitoringImage`)는 `image`와 같은 로직에 기본 이미지만 `{업로드 폴더}/noimage.jpg`. 프론트 `fileApi.monitoringUrl`, `TopBar.tsx`가 AS-IS `MainFrame` L538처럼 로그인 사원(`useLoginUser().userId`)의 사진을 35×35 원형(`border-radius 70%`·`object-fit cover`)으로 보여 준다. 사진을 못 불러오면(기본 이미지 파일도 없을 때 404) 예전의 사람 아이콘 아바타로 돌아간다 |
| 2026-11-04 | 확인 | `SysFileUploadPolicyDbTest` 4번째 시험: 사진 없는 부모는 `noimage.jpg`, 일반 이미지는 `nonamed.jpg`, 올려 둔 사진이 있으면 그 사진. `tsc -b` 통과, 배포 후 `GET …/monitoring?parentId=-28656` → 404 "파일을 찾을 수 없습니다." — **이 개발 PC 업로드 폴더(`~/tmp/asseterp-data/uploads`)에 `noimage.jpg`가 없어서**다(AS-IS도 기본 이미지는 서버에 늘 있다고 가정). 그 상태에서는 아이콘 아바타가 보인다 |
| 2026-11-04 | 미확인 | 화면에서 실제 TopBar 모양(35px 사진이 50px 막대에 맞는지, 사진이 있는 사원일 때)은 보지 않았다 — `localhost:5173`에서 확인 필요. `noimage.jpg`를 업로드 폴더에 두면 기본 이미지가 보인다 |
| 2026-11-04 | 참고 | `Monitoring_Page_Emp`(L166, 같은 `fileType=monitoring` 호출)는 변환 목록에 없는 화면이다 |

## 비용
파일 계열 대조 묶음 세션(SFD01~08). 코드 변경 없음. `yunhee cat FileDownload.java`·`yunhee grep`·`analysis sql`로 대조.
