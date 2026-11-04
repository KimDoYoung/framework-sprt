# SFU06 FileUpload/소형 업로드 `ics01` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadIcs01 L542-590`. TOBE: `IcsFormFileAdminController` `POST …` → `IcsFormFileAdminService.upload`. **판정: 완료** |
| 2026-11-04 | 대조 | 첨부를 올리고(부모 `parentId`=0, `fileYn` true) `law_type`=법령구분·`admin_yn` 'true'·`note`=내용을 채운다. TOBE `updateUploadMeta`가 같은 세 열을 갱신한다. 다른 점: TOBE는 sys admin 확인(`requireSysAdmin`)과 법령구분 필수 검사를 더 한다(TOBE 보강, 원본은 화면에서만 제한). 실제 업로드는 확인하지 않았다(미확인) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
