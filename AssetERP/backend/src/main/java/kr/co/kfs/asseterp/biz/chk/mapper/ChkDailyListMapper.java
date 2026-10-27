package kr.co.kfs.asseterp.biz.chk.mapper;

import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListConfirmRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListSaveReq;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListWriteRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ChkDailyListMapper {

    /** AS-IS chk02_daily_list.selectByAdmin — 기준 분류와 그 아래, 로그인 회사 행 */
    List<ChkDailyListRes> selectByAdmin(@Param("companyId") Long companyId, @Param("parentTreeId") Long parentTreeId,
                                        @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS chk02_daily_list.selectById — 저장 결과 한 행 */
    ChkDailyListRes selectById(@Param("dailyListId") Long dailyListId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Chk02_DailyList.modelUpdate → UpdateDataModel INSERT (adminDailyListId = 0) */
    int insert(@Param("companyId") Long companyId, @Param("dailyListId") Long dailyListId, @Param("req") ChkDailyListSaveReq req);

    /** AS-IS Chk02_DailyList.modelUpdate → UpdateDataModel UPDATE — 로그인 회사 행만 */
    int update(@Param("companyId") Long companyId, @Param("dailyListId") Long dailyListId, @Param("req") ChkDailyListSaveReq req);

    /** AS-IS Chk02_DailyList.delete → UpdateDataModel.deleteModel — 로그인 회사 행만 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("dailyListIds") List<Long> dailyListIds);

    /** AS-IS chk02_daily_list.selectByAdminDailyListId — 그 고객사에 이미 복사된 행 수 */
    int countByAdminDailyListId(@Param("companyId") Long companyId, @Param("adminDailyListId") Long adminDailyListId);

    /** AS-IS chk02_daily_list.updateFromAdmin */
    int updateFromAdmin(@Param("companyId") Long companyId, @Param("dailyListId") Long dailyListId, @Param("classTreeId") Long classTreeId,
                        @Param("content") String content, @Param("explan") String explan);

    /** AS-IS chk02_daily_list.insertFromAdmin */
    int insertFromAdmin(@Param("companyId") Long companyId, @Param("dailyListId") Long dailyListId);

    /** AS-IS chk02_daily_list.selectBySearchText2 — 사용여부 조건 없이 */
    List<ChkDailyListRes> selectBySearchText2(@Param("companyId") Long companyId, @Param("parentTreeId") Long parentTreeId,
                                              @Param("searchText") String searchText);

    /** AS-IS chk02_daily_list.updateUseYn */
    int updateUseYn(@Param("companyId") Long companyId, @Param("dailyListId") Long dailyListId, @Param("useYn") String useYn);

    /** AS-IS chk02_daily_list.updateWriteGroupId */
    int updateWriteGroupId(@Param("companyId") Long companyId, @Param("dailyListId") Long dailyListId, @Param("writeGroupId") Long writeGroupId);

    /** AS-IS chk02_daily_list.selectByPersonId — 내가 속한 작성그룹의 점검내역 + 그 날짜의 내 작성 행 */
    List<ChkDailyListWriteRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                @Param("parentTreeId") Long parentTreeId, @Param("stdDate") LocalDate stdDate,
                                                @Param("checkBox") boolean checkBox);

    /** AS-IS chk03_daily_list_write.selectDailyListStatusPaging — 점검일의 담당자별 점검내역(확인 대상 = 확인자가 나인 행) */
    List<ChkDailyListConfirmRes> selectConfirmListPaging(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId,
                                                         @Param("parentTreeId") Long parentTreeId, @Param("date") LocalDate date,
                                                         @Param("searchText") String searchText, @Param("unCheckYn") String unCheckYn,
                                                         @Param("unConfirmYn") String unConfirmYn,
                                                         @Param("limit") long limit, @Param("offset") long offset);

    /** AS-IS chk03_daily_list_write.selectDailyListStatusPagingTotal */
    long selectConfirmListTotal(@Param("companyId") Long companyId, @Param("confirmerId") Long confirmerId,
                                @Param("parentTreeId") Long parentTreeId, @Param("date") LocalDate date,
                                @Param("searchText") String searchText, @Param("unCheckYn") String unCheckYn,
                                @Param("unConfirmYn") String unConfirmYn);
}
