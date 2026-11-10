package kr.co.kfs.asseterp.biz.apr.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprPdfDocRow;

/** 결재문서 PDF 미리보기 (AS-IS apr.Apr10_StampPDF7 · apr10_stamp.selectByPDFId · dcr30_link.selectByClassTreeId) — PDF 시뮬레이터 */
@Mapper
public interface AprPdfMapper {

    /** AS-IS apr10_stamp.selectByPDFId — 문서의 제목 파일(sys10_title_yn = 'true', 결재완료 때 만든 PDF) 첫 파일 ID */
    Long selectTitleFileId(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** AS-IS dcr30_link.selectByClassTreeId — 첫 행의 링크코드 */
    String selectLinkCode(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    /** 저장된 문서 (로그인 회사) */
    AprPdfDocRow selectDoc(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** 회사 위치(sys01_loc_nm) — 머리글·주소 설정 키 */
    String selectCompanyLoc(@Param("companyId") Long companyId);
}
