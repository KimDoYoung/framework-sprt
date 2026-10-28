package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay08_tax_withholding.xml — 원천징수영수증 */
@Mapper
public interface PayTaxReceiptMapper {
    /** AS-IS selectByPersonId */
    List<PayTaxReceiptRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS selectByCompanyId (S25) */
    List<PayTaxReceiptRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS selectByPersonId에 회사 조건을 더한 것 (S25, TOBE 추가) */
    List<PayTaxReceiptRes> selectByCompanyAndPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS getSeq와 같은 식 */
    Long selectNextId();

    /** AS-IS insert */
    int insert(@Param("taxWithholdingId") Long taxWithholdingId, @Param("companyId") Long companyId);

    /** UpdateDataModel update — 사원·비고 */
    int update(@Param("companyId") Long companyId, @Param("req") PayTaxReceiptSaveReq req);

    /** UpdateDataModel delete */
    int delete(@Param("companyId") Long companyId, @Param("taxWithholdingId") Long taxWithholdingId);

    /** 로그인 회사의 영수증 행 수(0/1) */
    int countOwn(@Param("companyId") Long companyId, @Param("taxWithholdingId") Long taxWithholdingId);

    /** 로그인 회사 소속 사원 수(0/1) */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
