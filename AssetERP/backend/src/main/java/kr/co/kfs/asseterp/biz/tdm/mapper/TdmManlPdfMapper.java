package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPdfTarget;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** 책무매뉴얼 PDF 생성에 쓰는 문장 (AS-IS Sys99_Print.CreateTdmManlOrg · Tdm42_ManlOrg.fileCheck · Sys10_File.getServerPath) */
@Mapper
public interface TdmManlPdfMapper {

    /** createRd가 읽는 화면 모델 값 + getServerPath의 회사 폴더 이름 */
    ManlOrgPdfTarget selectPdfTarget(@Param("manlOrgId") Long manlOrgId);

    /** AS-IS sys99_print.deleteByPJobTp */
    int deletePrintByJobTp(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("pJobTp") String pJobTp);

    /** AS-IS sys99_print.tdmCreateData → 보고서 자료를 sys99_print에 채운다 */
    String createTdmData(@Param("pJobTp") String pJobTp, @Param("regDate") String regDate, @Param("pId") Long pId,
                         @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("groupId") Long groupId);

    /** AS-IS IsNewData.getSeq (dbConfig.getSeq) */
    Long selectNextId();
}
