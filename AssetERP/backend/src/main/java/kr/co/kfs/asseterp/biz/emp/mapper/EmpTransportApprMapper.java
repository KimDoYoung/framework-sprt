package kr.co.kfs.asseterp.biz.emp.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** A42 여비교통비 신청서의 영수증 파일 → 결재문서 연결 (AS-IS Apr03_Page_Relate.insertFileList → Sys10_File.copyFile, V36) */
@Mapper
public interface EmpTransportApprMapper {

    long selectNextId();

    /** 로그인 사원 본인의 여비교통비인지 */
    int countOwn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("transportExpenseId") Long transportExpenseId);

    /** AS-IS sys10_file.selectByParentId — 그 행의 파일(부모이거나 연결된 파일) */
    List<Long> selectFileIds(@Param("parentId") Long parentId);

    int countApprRelateFile(@Param("fileId") Long fileId, @Param("apprId") Long apprId);

    int insertApprRelateFile(@Param("relateFileId") Long relateFileId, @Param("fileId") Long fileId, @Param("apprId") Long apprId);
}
