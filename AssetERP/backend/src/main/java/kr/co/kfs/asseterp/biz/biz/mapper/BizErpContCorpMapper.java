package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizErpContCorpRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpContCorpSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/biz/mapper/biz51_erp_cont_corp · biz52_erp_fee.deleteByErpContCorpId · com01_relate_appr.deleteByKeyTableId · sys10_file.deleteByParentId — AssetERP 계약사 관리 Biz51_Tab_ErpContCorp (EE22) */
@Mapper
public interface BizErpContCorpMapper {

    List<BizErpContCorpRes> selectByContStatusCode(@Param("contStatusCode") String contStatusCode, @Param("searchText") String searchText);

    BizErpContCorpRes selectById(@Param("erpContCorpId") Long erpContCorpId);

    long selectNextId();

    int countById(@Param("erpContCorpId") Long erpContCorpId);

    int insertErpContCorp(@Param("r") BizErpContCorpSaveReq r);

    int updateErpContCorp(@Param("r") BizErpContCorpSaveReq r);

    int deleteRelateApprByKey(@Param("erpContCorpId") Long erpContCorpId);

    int deleteFilesByParent(@Param("erpContCorpId") Long erpContCorpId);

    int deleteFeesByErpContCorp(@Param("erpContCorpId") Long erpContCorpId);

    int deleteById(@Param("erpContCorpId") Long erpContCorpId);
}
