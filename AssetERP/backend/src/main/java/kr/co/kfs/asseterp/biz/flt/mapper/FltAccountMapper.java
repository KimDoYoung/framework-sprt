package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.AccountAdminRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountCloseRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountRes;
import kr.co.kfs.asseterp.biz.flt.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.flt.dto.AccountStatusRes;
import kr.co.kfs.asseterp.biz.flt.dto.DocClassRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt03_account.xml, flt06_account_close.xml + UpdateDataModel(flt03_account, flt06_account_close) */
@Mapper
public interface FltAccountMapper {

    // flt03_account
    List<AccountRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS flt03_account.selectByDate — 기준일에 재직 중인 사원의 계좌. personId가 null이면 회사 전체(J01), 값이 있으면 그 사원(J07) */
    List<AccountAdminRes> selectByDate(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("setupDate") String setupDate,
                                       @Param("closeAccountYn") boolean closeAccountYn);

    AccountRes selectById(@Param("accountId") Long accountId);

    Long selectNextId();

    /** AS-IS dbConfig.getEncrypts */
    String selectEncrypted(@Param("text") String text);

    int insertAccount(@Param("accountId") Long accountId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("accountNo") String accountNo, @Param("req") AccountSaveReq req);

    int updateAccount(@Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("accountNo") String accountNo, @Param("req") AccountSaveReq req);

    int deleteAccounts(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountIds") List<Long> accountIds);

    /** AS-IS flt10_tr.checkTrByAccountId */
    int countTrByAccountId(@Param("accountId") Long accountId);

    /** AS-IS flt03_account.getItemTypeName */
    String selectItemTypeName(@Param("companyId") Long companyId, @Param("itemType") String itemType);

    // flt06_account_close
    List<AccountCloseRes> selectCloseByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS flt11_book.checkBookQtyByAccountId */
    int countBookQty(@Param("accountId") Long accountId, @Param("closeDate") String closeDate);

    int insertAccountClose(@Param("accountId") Long accountId, @Param("closeDate") String closeDate);

    int deleteAccountCloses(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("accountCloseIds") List<Long> accountCloseIds);

    // 안내 두 줄
    String selectCheckCycle(@Param("companyId") Long companyId, @Param("personId") Long personId);

    AccountStatusRes selectOath(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS dcr01_class_tree.selectByLinkCode */
    DocClassRes selectDocClassByLinkCode(@Param("companyId") Long companyId, @Param("linkCode") String linkCode);
}
