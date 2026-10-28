package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay08_tax_withholding.xml — 원천징수영수증 */
@Mapper
public interface PayTaxReceiptMapper {
    /** AS-IS selectByPersonId */
    List<PayTaxReceiptRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
