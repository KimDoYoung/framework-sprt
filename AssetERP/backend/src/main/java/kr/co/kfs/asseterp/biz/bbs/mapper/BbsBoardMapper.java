package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.BbsBoardRes;
import kr.co.kfs.asseterp.biz.bbs.dto.BbsBoardSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs01_board.xml + UpdateDataModel(bbs01_board) — 게시판 등록·수정 창(Bbs01_Lookup_BoardInsert·BoardUpdate) */
@Mapper
public interface BbsBoardMapper {

    /** 로그인 회사의 게시판 한 건 (수정 창을 열 때·저장 전 검사). 없으면 null */
    BbsBoardRes selectById(@Param("companyId") Long companyId, @Param("boardId") Long boardId);

    /** AS-IS bbs01_board.selectByCompanyId — 자유게시판 목록(Bbs01_Tab_Board·Bbs01_Tab_BoardManager). 제목·구분은 LIKE 패턴으로 받는다 */
    List<BbsBoardRes> selectList(@Param("companyId") Long companyId, @Param("typeCode") String typeCode, @Param("title") String title);

    /** AS-IS DBUtil.setSeq / dbConfig.getSeq */
    long selectNextId();

    int update(@Param("companyId") Long companyId, @Param("req") BbsBoardSaveReq req);

    int insert(@Param("companyId") Long companyId, @Param("writeUserId") Long writeUserId, @Param("req") BbsBoardSaveReq req);

    int delete(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
