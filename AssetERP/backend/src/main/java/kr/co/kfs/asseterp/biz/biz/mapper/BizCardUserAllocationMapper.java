package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizCardUserAllocationRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BizCardUserAllocationMapper {

    /** AS-IS biz01_promo.selectCardCommonUser — 공통카드 내역. unassignedOnly면 실사용자가 비어 있는 건만 */
    List<BizCardUserAllocationRes> selectCardCommonUser(@Param("companyId") Long companyId, @Param("dataYm") String dataYm,
                                                        @Param("providePurCode") String providePurCode,
                                                        @Param("unassignedOnly") boolean unassignedOnly);

    /** AS-IS biz01_promo.updateRealPersonId */
    int updateRealPersonId(@Param("promoId") Long promoId, @Param("realPersonId") Long realPersonId);
}
