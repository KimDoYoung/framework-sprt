package kr.co.kfs.asseterp.biz.crd.mapper;

import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanyRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdExcelCompanySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/crd/mapper/crd10_excel_company.xml + UpdateDataModel(crd10_excel_company) — 법인카드 업로드 카드사 */
@Mapper
public interface CrdExcelCompanyMapper {
    /** AS-IS selectByCompanyId */
    List<CrdExcelCompanyRes> selectByCompanyId(@Param("companyId") Long companyId);

    CrdExcelCompanyRes selectById(@Param("excelCompanyId") Long excelCompanyId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("excelCompanyId") Long excelCompanyId, @Param("companyId") Long companyId, @Param("req") CrdExcelCompanySaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") CrdExcelCompanySaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
