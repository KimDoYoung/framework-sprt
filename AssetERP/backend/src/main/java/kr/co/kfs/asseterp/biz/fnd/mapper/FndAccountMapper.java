package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.IpoAccountRes;
import kr.co.kfs.asseterp.biz.fnd.dto.IpoAccountSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/fnd/mapper/fnd32_account.xml + ExcelUpload.accountUpload가 부르는 sys15_corp.selectByCorpName · sys09_code.selectByName */
@Mapper
public interface FndAccountMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS selectByText — searchText는 "%…%", accountStateCode는 코드 또는 "%"(전체) */
    List<IpoAccountRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                     @Param("accountStateCode") String accountStateCode);

    /** AS-IS selectById — 로그인 회사 행만 */
    IpoAccountRes selectById(@Param("accountId") Long accountId, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel 동적 INSERT — 계좌번호·은행연계계좌는 TO_ENCRYPTS(fnd32_account.encrypts) */
    int insertAccount(@Param("id") Long accountId, @Param("companyId") Long companyId, @Param("r") IpoAccountSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE */
    int updateAccount(@Param("companyId") Long companyId, @Param("r") IpoAccountSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteAccounts(@Param("companyId") Long companyId, @Param("accountIds") List<Long> accountIds);

    /** AS-IS sys15_corp.selectByCorpName — 사용 중인 거래처의 첫 행 ID, 없으면 null */
    Long selectCorpIdByName(@Param("companyId") Long companyId, @Param("corpName") String corpName);

    /** AS-IS sys09_code.selectByName — 코드 종류의 이름으로 첫 코드, 없으면 null */
    String selectCodeByName(@Param("companyId") Long companyId, @Param("kindCode") String kindCode, @Param("name") String name,
                            @Param("applyDate") LocalDate applyDate);
}
