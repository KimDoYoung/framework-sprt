# bbs01_board

`server/bbs/mapper/bbs01_board.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`bbs01_board`](../../../db/tables/bbs.md), [`emp00_trans_info`](../../../db/views.md) | `f_cdnm`, `f_emp_kor_nm` | `bbs.Bbs01_Board.selectById` |
| `selectByCompanyId` | select | 37 | [`bbs01_board`](../../../db/tables/bbs.md), [`emp00_trans_info`](../../../db/views.md) | `f_cdnm`, `f_emp_kor_nm` | `bbs.Bbs01_Board.selectByCompanyId` |
| `selectByCompanyId1` | select | 51 | [`bbs01_board`](../../../db/tables/bbs.md), [`sys02_user`](../../../db/tables/sys.md) | `f_cdnm` | - |
| `selectByTypeCode` | select | 62 | [`bbs01_board`](../../../db/tables/bbs.md), [`sys02_user`](../../../db/tables/sys.md) | `f_cdnm` | `bbs.Bbs01_Board.selectByTypeCode` |
