package kr.co.kfs.asseterp.biz.crd.mapper;

import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCodeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/crd/mapper/crd11_excel_code.xml + UpdateDataModel(crd11_excel_code) — 법인카드 업로드 구분코드 맵핑 */
@Mapper
public interface CrdExcelCodeMapper {
    /** AS-IS selectByCompanyId (회사 + 카드사) */
    List<CrdExcelCodeRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("bankCode") String bankCode);

    CrdExcelCodeRes selectById(@Param("excelCodeId") Long excelCodeId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("excelCodeId") Long excelCodeId, @Param("companyId") Long companyId, @Param("req") CrdExcelCodeSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") CrdExcelCodeSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
