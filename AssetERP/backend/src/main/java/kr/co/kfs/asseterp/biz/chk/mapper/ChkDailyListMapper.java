package kr.co.kfs.asseterp.biz.chk.mapper;

import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListRes;
import kr.co.kfs.asseterp.biz.chk.dto.ChkDailyListSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
}
