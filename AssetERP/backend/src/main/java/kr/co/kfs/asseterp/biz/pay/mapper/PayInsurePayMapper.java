package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePayRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePaySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay32_insure_pay.xml + UpdateDataModel(pay32_insure_pay) — 4대보험 연말정산 납부(S16) */
@Mapper
public interface PayInsurePayMapper {
    /** AS-IS selectByPersonId (year·insureCode는 LIKE 값, 전체는 "%") */
    List<PayInsurePayRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                           @Param("insureCode") String insureCode, @Param("year") String year);

    /** AS-IS selectByCompanyId (S27) — personId가 null이면 회사 전체 */
    List<PayInsurePayRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                            @Param("insureCode") String insureCode, @Param("year") String year);

    PayInsurePayRes selectById(@Param("companyId") Long companyId, @Param("insurePayId") Long insurePayId);

    Long selectNextId();

    int insert(@Param("insurePayId") Long insurePayId, @Param("companyId") Long companyId, @Param("req") PayInsurePaySaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") PayInsurePaySaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
