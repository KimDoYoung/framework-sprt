package kr.co.kfs.asseterp.biz.car.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** 차량 운행일지 결재 상신(A16, V35) — car05_relate_appr 기록과 상신 문서에 붙일 PDF 첨부 연결 */
@Mapper
public interface CarJournalApprMapper {

    /** AS-IS car05_relate_appr.insert */
    int insertRelateAppr(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId,
                         @Param("yyyymm") String yyyymm, @Param("infoId") Long infoId);

    /** AS-IS car05_relate_appr.updateApprId (회사 조건 추가) */
    int updateApprId(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** 상신 행이 로그인 회사 것인지(A16 결재창을 열 때) */
    int countRelateAppr(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId);

    /** AS-IS sys10_file.selectByParentId의 파일 ID (Apr03_Page_Relate.createFileLine → Apr01_Grid_ApprFile.retrieve) */
    List<Long> selectFileIds(@Param("parentId") Long parentId);

    int countApprRelateFile(@Param("fileId") Long fileId, @Param("apprId") Long apprId);

    /** AS-IS sys11_relate_file.insert */
    int insertApprRelateFile(@Param("relateFileId") long relateFileId, @Param("fileId") Long fileId, @Param("apprId") Long apprId);

    long selectNextId();
}
