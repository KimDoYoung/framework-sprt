package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizErpMailFormRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpSetupRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizErpSetupSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/biz/mapper/biz50_erp_setup — AssetERP 기본설정 Biz50_Lookup_ErpSetup (EE22) */
@Mapper
public interface BizErpSetupMapper {

    List<BizErpSetupRes> selectAll(@Param("companyId") Long companyId);

    BizErpSetupRes selectByStartDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    BizErpSetupRes selectById(@Param("erpSetupId") Long erpSetupId);

    long selectNextId();

    int countById(@Param("erpSetupId") Long erpSetupId);

    int insertErpSetup(@Param("r") BizErpSetupSaveReq r);

    int updateErpSetup(@Param("r") BizErpSetupSaveReq r);

    int deleteById(@Param("erpSetupId") Long erpSetupId);

    /** getNote(noteYn = 'true') — 메모 행이 없으면 null */
    String selectNote();

    int upsertNote(@Param("note") String note);

    /** selectMailForm(noteYn = 'false') — 적용시작일 없는 메일양식 행, 없으면 null */
    BizErpMailFormRes selectMailForm();

    int insertMailForm(@Param("erpSetupId") Long erpSetupId, @Param("mailForm") String mailForm);

    int updateMailForm(@Param("erpSetupId") Long erpSetupId, @Param("mailForm") String mailForm);
}
