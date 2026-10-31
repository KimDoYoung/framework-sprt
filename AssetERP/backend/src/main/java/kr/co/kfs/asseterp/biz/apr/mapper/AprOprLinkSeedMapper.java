package kr.co.kfs.asseterp.biz.apr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprLinkRelateFundRes;

/** A26·A38 공모주 결재문서를 열 때 연관펀드·연관일임 탭에 자동으로 넣을 펀드 조회 (Apr03_Page_Relate.insertRelateFundList(List), V38) */
@Mapper
public interface AprOprLinkSeedMapper {

    /** AS-IS fnd31_opr_fund.selectByDistinctOprId — 이 운용지시의 펀드 ID(중복 없이, 펀드 ID 순) */
    List<Long> selectDistinctFundIds(@Param("oprId") Long oprId);

    /** AS-IS fnd00_fund.selectById(오늘 기준 펀드 정보) — 펀드가 아니면 null */
    AprLinkRelateFundRes selectFund(@Param("companyId") Long companyId, @Param("fundId") Long fundId);

    /** AS-IS adv02_account.selectById — 일임계좌가 아니면 null */
    AprLinkRelateAdvRes selectAdv(@Param("companyId") Long companyId, @Param("accountId") Long accountId);
}
