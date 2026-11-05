# SFU03 FileUpload/소형 업로드 `flt07` — 작업기록

## 기록
| 날짜 | 상태 | 내용 |
|:---|:---|:---|
| 2026-11-04 | 분기 | 원본 `uploadFlt07 L329-380`. TOBE: (없음). **판정: 대기** |
| 2026-11-04 | 대조 | 가족금융거래정보 이용동의서: `flt07_family_consent`(동의 ID, 사원 ID) + 첨부(부모=동의 ID, 파일 구분 false). 호출은 `Flt02_Lookup_Emp`(L229, `personId`=로그인 사원) [파일업로드] |
| 2026-11-04 | 결과 | **화면 선행**: TOBE에 `Flt02_Lookup_Emp`가 없다(I01·I02 결과확인의 "다음 단계"). 읽기 쪽(J07 `GET /sys/files/family-consent`)만 있다. SEU13과 같이 그 창을 변환하는 ID에서 이 분기를 같이 만든다 — 사용자 결정 2026-11-04(SEU13과 같은 방침으로 이해했으나 이 분기는 명시적으로 묻지 않았다) |

## 비용
파일 계열 대조 묶음 세션. `yunhee cat`·`analysis sql`·`grep`로 대조.
