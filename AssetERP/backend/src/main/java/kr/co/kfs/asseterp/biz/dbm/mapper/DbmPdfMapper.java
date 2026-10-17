package kr.co.kfs.asseterp.biz.dbm.mapper;

import kr.co.kfs.asseterp.biz.dbm.dto.PdfTargetParam;
import kr.co.kfs.asseterp.biz.dbm.dto.PdfTargetRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/apr/mapper/apr01_appr.xml selectPdfMakeTarget (Dbm10_Tab_MakePdf가 쓰는 조회) */
@Mapper
public interface DbmPdfMapper {
    /** AS-IS selectPdfMakeTarget */
    List<PdfTargetRes> selectPdfMakeTarget(PdfTargetParam param);
}
