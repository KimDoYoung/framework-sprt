package kr.co.kfs.asseterp.biz.pay.mapper;

import kr.co.kfs.asseterp.biz.pay.dto.FavoriteAccountRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/pay/mapper/pay52_favorite_account.xml — 자주 쓰는 계정과목 (U03 계정과목 조회창) */
@Mapper
public interface PayFavoriteAccountMapper {
    /** AS-IS selectByCompanyId */
    List<FavoriteAccountRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("attributeCode") String attributeCode,
                                               @Param("searchText") String searchText, @Param("allAccountYn") boolean allAccountYn);

    /** AS-IS countByAccountCodeId (회사 조건은 TOBE 추가) */
    int countByAccountCodeId(@Param("companyId") Long companyId, @Param("accountCodeId") Long accountCodeId);

    /** 계정코드가 이 회사 것인지 (TOBE 추가) */
    int countAccountCode(@Param("companyId") Long companyId, @Param("accountCodeId") Long accountCodeId);

    Long selectNextId();

    /** AS-IS insert */
    int insert(@Param("favoriteAccountId") Long favoriteAccountId, @Param("companyId") Long companyId, @Param("accountCodeId") Long accountCodeId);

    /** AS-IS UpdateDataModel(pay52_favorite_account) → 화면이 바꾸는 열은 seq */
    int updateSeq(@Param("companyId") Long companyId, @Param("favoriteAccountId") Long favoriteAccountId, @Param("seq") Long seq);

    /** AS-IS UpdateDataModel DELETE */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
