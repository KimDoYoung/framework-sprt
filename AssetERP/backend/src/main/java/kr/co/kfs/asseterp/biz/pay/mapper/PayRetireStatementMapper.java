package kr.co.kfs.asseterp.biz.pay.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** 퇴직정산서 생성 (AS-IS server/pay/Pay07_Retire · pay07_retire.xml) — EE96 Pay07_Lookup_RetireCreate */
@Mapper
public interface PayRetireStatementMapper {

    /** AS-IS pay07_retire.checkAppr — 'false'면 결재 진행중·완료 */
    String checkAppr(@Param("personId") Long personId);

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS Pay07_Retire.createRetire의 `call pay07_retire_create(?×9)` */
    int createRetire(@Param("personId") Long personId, @Param("userId") Long userId, @Param("calcMonth") Long calcMonth,
                     @Param("fixHi") Long fixHi, @Param("fixLt") Long fixLt, @Param("fixEi") Long fixEi,
                     @Param("nonHiYn") boolean nonHiYn, @Param("nonLtYn") boolean nonLtYn, @Param("nonEiYn") boolean nonEiYn);
}
