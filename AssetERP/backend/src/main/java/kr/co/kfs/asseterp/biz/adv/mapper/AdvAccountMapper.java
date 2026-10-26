package kr.co.kfs.asseterp.biz.adv.mapper;

import kr.co.kfs.asseterp.biz.adv.dto.AccountExcelRow;
import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import kr.co.kfs.asseterp.biz.adv.dto.AccountSaveReq;
import kr.co.kfs.asseterp.biz.adv.dto.AccountSearchParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/adv/Adv02_Account (adv02_account 매퍼) + ExcelUpload.adv02Upload가 부르는 sys15_corp.checkExcelUpload */
@Mapper
public interface AdvAccountMapper {

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS adv02_account.selectByManageNamePaging */
    List<AccountRes> selectByManageNamePaging(@Param("p") AccountSearchParam param);

    /** AS-IS adv02_account.selectByManageNamePagingTotal */
    long selectByManageNamePagingTotal(@Param("p") AccountSearchParam param);

    /** AS-IS adv02_account.selectById */
    AccountRes selectById(@Param("accountId") Long accountId, @Param("companyId") Long companyId);

    /** AS-IS adv02_account.checkManageCode — 같은 회사에 같은 관리코드의 다른 계좌 수 (accountId가 null이면 원본처럼 0) */
    int checkManageCode(@Param("accountId") Long accountId, @Param("companyId") Long companyId, @Param("manageCode") String manageCode);

    /** AS-IS adv02_account.selectByManageCode — 엑셀 업로드 중복 검사 */
    int countByManageCode(@Param("companyId") Long companyId, @Param("manageCode") String manageCode);

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertAccount(@Param("id") Long accountId, @Param("companyId") Long companyId, @Param("r") AccountSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE */
    int updateAccount(@Param("companyId") Long companyId, @Param("r") AccountSaveReq req);

    /** AS-IS adv02_account.insert (엑셀 업로드) */
    int excelInsert(@Param("r") AccountExcelRow row);

    /** AS-IS sys15_corp.checkExcelUpload(corpType 3) — 거래처명이 같은 사용 중인 증권사의 거래처 코드. 없으면 행 없음 */
    List<String> selectTrCorpCodesByName(@Param("companyId") Long companyId, @Param("corpName") String corpName);
}
