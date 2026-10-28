package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayActMappingSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay06_act_mapping.xml + UpdateDataModel(pay06_act_mapping) — 계약서 Mapping */
@Mapper
public interface PayActMappingMapper {
    /** AS-IS selectByLinkCode */
    List<PayActMappingRes> selectByLinkCode(@Param("companyId") Long companyId, @Param("linkCode") String linkCode,
                                            @Param("kindCode") String kindCode);

    PayActMappingRes selectById(@Param("actMappingId") Long actMappingId, @Param("companyId") Long companyId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("actMappingId") Long actMappingId, @Param("companyId") Long companyId, @Param("req") PayActMappingSaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayActMappingSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
