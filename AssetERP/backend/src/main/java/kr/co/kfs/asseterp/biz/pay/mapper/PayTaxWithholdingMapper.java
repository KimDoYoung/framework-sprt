package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay40_income_tax_withholding.xml + UpdateDataModel(pay40_income_tax_withholding) — 갑근세확인서 발급 */
@Mapper
public interface PayTaxWithholdingMapper {
    /** AS-IS selectByCompanyId */
    List<PayTaxWithholdingRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("stdYear") String stdYear);

    /** AS-IS selectById — 저장·삭제 전 상신상태 확인과 저장 뒤 돌려줄 행 */
    PayTaxWithholdingRes selectById(@Param("companyId") Long companyId, @Param("incomeTaxWithholdingId") Long incomeTaxWithholdingId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** AS-IS insert — 발급번호는 같은 연도·회사의 최대값 + 1 */
    int insert(@Param("incomeTaxWithholdingId") Long incomeTaxWithholdingId, @Param("companyId") Long companyId,
               @Param("req") PayTaxWithholdingSaveReq req);

    /** UpdateDataModel UPDATE — 화면이 고치는 5열만 */
    int update(@Param("companyId") Long companyId, @Param("req") PayTaxWithholdingSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** TOBE 추가: 저장 대상 사원이 로그인 회사 소속인지 */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
