package kr.co.kfs.asseterp.biz.biz.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.biz.dto.BizEachContLinkRow;

/** 계약사관리 개별계약서(biz16_each_contract) — 결재창 C01 (V35) */
@Mapper
public interface BizEachContMapper {

    /** AS-IS biz16_each_contract.selectById + 호출 화면의 계약사 행(biz10_cont_corp.selectByText의 최신 이력 biz11) — 로그인 회사 행만 */
    BizEachContLinkRow selectLinkById(@Param("contractId") Long contractId, @Param("companyId") Long companyId);
}
