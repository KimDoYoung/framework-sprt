package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.AccountRes;
import kr.co.kfs.asseterp.biz.emp.dto.AccountSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/Emp14_Account.java */
@Mapper
public interface EmpAccountMapper {

    /** AS-IS emp14_account.selectByPersonId */
    List<AccountRes> selectAccounts(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp14_account.selectById */
    AccountRes selectAccountById(@Param("accountId") Long accountId, @Param("companyId") Long companyId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextAccountId();

    /** INSERT — TO_ENCRYPTS(accountNoDec) */
    int insertAccount(@Param("accountId") Long accountId, @Param("companyId") Long companyId,
                      @Param("personId") Long personId, AccountSaveReq req);

    /** UPDATE — accountNoDec not null이면 TO_ENCRYPTS, 아니면 기존 값 유지 */
    int updateAccount(@Param("accountId") Long accountId, @Param("companyId") Long companyId, AccountSaveReq req);

    /** AS-IS UpdateDataModel(emp14_account).deleteModel */
    int deleteAccounts(@Param("accountIds") List<Long> accountIds, @Param("companyId") Long companyId);
}
