# SFU02 FileUpload/소형 업로드 `filebox (목록의 `fbx03`)` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadFbx03 L250-327`. TOBE: `FbxFileController` `POST /api/v1/fbx/files`(`mode=filebox`) → `FbxFileService.upload`. **판정: 완료** |
| 2026-11-04 | 대조 | 목록의 모드 이름 `fbx03`은 틀렸고 실제 값은 `filebox`. 파일마다 `fbx03_file`(상태 00·생성일·비고 '')·`sys10_file`(부모=fbx03 ID)·`fbx02_history`(구분 01) 세 INSERT, 하나라도 실패하면 전체 롤백. SQL 세 개를 `analysis sql`로 대조: TOBE `insertFile`·`insertHistory`가 같고 `seq`는 `coalesce(max(seq),1)` 그대로 |
| 2026-11-04 | 결과 | **고친 것**: 원본은 첨부(`sys10_file`) 비고에 `파일보관함: boxId:…, classid:…, orgCodeId:…, empId:…`를 남기는데 TOBE에는 없어서 `FbxFileMapper.updateAttachNote`를 추가하고 `FbxFileService.upload`에서 호출(`FbxFileNoteDbTest` 1개 통과, 롤백) |
| 2026-11-04 | 참고 | 다른 점(기록만): `orgCodeId`·`empId`를 TOBE는 로그인 사용자에서 얻고(AS-IS는 화면 값을 믿음), 보관함이 로그인 회사 것인지 먼저 확인한다(TOBE 보강). 실제 파일 올리기·화면 시험은 하지 않았다(미확인) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
