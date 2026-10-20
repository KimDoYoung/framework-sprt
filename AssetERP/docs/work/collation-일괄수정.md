# collation 일괄 수정 목록 (03 원칙 19)

2026-10-20 사용자 결정: TOBE 매퍼의 `COLLATE "ko-KR-x-icu"`를 AS-IS와 같은 `COLLATE "ko_KR.utf8"`로 바꾼다. 로컬 DB에는 `ko_KR.utf8`이 등록되어 있다(05 §6). 수정하면 `yunhee sql-check --tobe`와 `mapper-run --compare`로 다시 확인한다.

| 매퍼 | `ko-KR-x-icu` 위치 수 | 확인·수정 |
|:---|---:|:---|
| AprApprMapper.xml | 5 | 대기 |
| ChkClassTreeMapper.xml | 2 | 대기 |
| EmpExceptBizMapper.xml | 1 | 대기 |
| EmpPersonMapper.xml | 4 | 대기 |
| IcsRelateFileMapper.xml | 2 | 대기 |
| SysCorpMapper.xml | 2 | 대기 |
| SysFileMapper.xml | 3 | 대기 |
| SysWebsocketMapper.xml | 2 | 대기 |
| TdmDutyProgressMapper.xml | 3 | 대기 |
| TdmDutyReconMapper.xml | 3 | 대기 |
| TdmManlMapper.xml | 7 | 대기 |
| TdmManlOrgMapper.xml | 2 | 대기 |
| TdmManlRelateIcsMapper.xml | 9 | 대기 |
| TdmRoleDescMapper.xml | 2 | 대기 |
| TdmRoleDigmMapper.xml | 2 | 대기 |

- 매퍼 밖(주석·문서)의 `ko-KR-x-icu` 언급: `grep -rn 'ko-KR-x-icu' docs backend/src`. 작업방법·결과확인 문서에도 남아 있으나 이력이므로 그대로 둔다.
