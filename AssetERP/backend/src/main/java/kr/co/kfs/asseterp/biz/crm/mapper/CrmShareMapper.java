package kr.co.kfs.asseterp.biz.crm.mapper;

import kr.co.kfs.asseterp.biz.crm.dto.CrmShareRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 영업거래처 기본공유(crm14)·업무활동 공유(crm15) — EE86 Crm14_Lookup_ShareDefault · EE87 Crm15_Lookup_Share */
@Mapper
public interface CrmShareMapper {

    long selectNextId();

    // ── crm14_share_default (거래처 기본 공유) ──
    List<CrmShareRes> selectDefaultByContactId(@Param("companyId") Long companyId, @Param("contactId") Long contactId);
    int deleteDefault(@Param("companyId") Long companyId, @Param("contactId") Long contactId, @Param("ids") List<Long> ids);
    int insertDefault(@Param("shareId") long shareId, @Param("companyId") Long companyId, @Param("contactId") Long contactId,
                      @Param("shareCode") String shareCode, @Param("personId") Long personId, @Param("orgId") Long orgId);
    String selectDefaultShareInfo(@Param("contactId") Long contactId);
    int countContact(@Param("companyId") Long companyId, @Param("contactId") Long contactId);

    // ── crm15_share (업무활동 공유) ──
    List<CrmShareRes> selectByWorkDetailId(@Param("companyId") Long companyId, @Param("workDetailId") Long workDetailId);
    int deleteShares(@Param("companyId") Long companyId, @Param("workDetailId") Long workDetailId, @Param("ids") List<Long> ids);
    int insertShare(@Param("shareId") long shareId, @Param("companyId") Long companyId, @Param("workDetailId") Long workDetailId,
                    @Param("shareCode") String shareCode, @Param("personId") Long personId, @Param("orgId") Long orgId);
    String selectShareInfo(@Param("workDetailId") Long workDetailId);
    int countWorkDetail(@Param("companyId") Long companyId, @Param("workDetailId") Long workDetailId);
}
