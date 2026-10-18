package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayRateRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRateSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay21_rate.xml + UpdateDataModel(pay21_rate) — 율관리 */
@Mapper
public interface PayRateMapper {
    /** AS-IS selectByCode (율 구분 LIKE) */
    List<PayRateRes> selectByCode(@Param("rateCode") String rateCode);

    PayRateRes selectById(@Param("rateId") Long rateId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    int insert(@Param("rateId") Long rateId, @Param("req") PayRateSaveReq req);

    int update(@Param("req") PayRateSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("ids") List<Long> ids);
}
