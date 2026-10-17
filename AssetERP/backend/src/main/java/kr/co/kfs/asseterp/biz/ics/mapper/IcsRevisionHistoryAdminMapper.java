package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionHistoryAdminSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsRevisionLawRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsRevisionHistoryAdminMapper {

    /** AS-IS ics20_revision_history.selectByDate — dateType 'reg'면 등록일, 아니면 시행일 기준 */
    List<IcsRevisionHistoryAdminRes> selectByDate(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                                  @Param("financeAgencyCode") String financeAgencyCode, @Param("searchText") String searchText,
                                                  @Param("relatedLawSearchText") String relatedLawSearchText, @Param("dateType") String dateType);

    /** AS-IS ics20_revision_history.selectById — 저장 결과 한 행 */
    IcsRevisionHistoryAdminRes selectById(@Param("revisionHistoryId") Long revisionHistoryId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Ics20_RevisionHistory.update(UpdateDataModel) — INSERT 부분 */
    int insert(@Param("revisionHistoryId") Long revisionHistoryId, @Param("req") IcsRevisionHistoryAdminSaveReq req);

    /** AS-IS Ics20_RevisionHistory.update(UpdateDataModel) — UPDATE 부분 (화면이 고치는 열만) */
    int update(@Param("revisionHistoryId") Long revisionHistoryId, @Param("req") IcsRevisionHistoryAdminSaveReq req);

    /** AS-IS Ics20_RevisionHistory.delete(UpdateDataModel.deleteModel) — ID로만 지운다 */
    int deleteById(@Param("revisionHistoryId") Long revisionHistoryId);

    /** AS-IS ics19_revision_relate_ics.selectByRevisionHistoryId */
    List<IcsRevisionLawRes> selectLaws(@Param("revisionHistoryId") Long revisionHistoryId);

    /** AS-IS ics19_revision_relate_ics.selectById — 저장 결과 한 행 */
    IcsRevisionLawRes selectLawById(@Param("revisionRelateIcsId") Long revisionRelateIcsId);

    /** AS-IS Ics19_RevisionRelateIcs.update(UpdateDataModel) — INSERT */
    int insertLaw(@Param("revisionRelateIcsId") Long revisionRelateIcsId, @Param("revisionHistoryId") Long revisionHistoryId, @Param("classTreeId") Long classTreeId);

    /** AS-IS Ics19_RevisionRelateIcs.delete(UpdateDataModel.deleteModel) */
    int deleteLawById(@Param("revisionRelateIcsId") Long revisionRelateIcsId);
}
