package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.JournalMapRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalMapSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act12_journal_map.xml — 분개맵핑 */
@Mapper
public interface ActJournalMapMapper {
    /** AS-IS selectByJournalGroup */
    List<JournalMapRes> selectByJournalGroup(@Param("companyId") Long companyId, @Param("journalGroup") String journalGroup);

    /** AS-IS selectById */
    JournalMapRes selectById(@Param("journalMapId") Long journalMapId);

    /** AS-IS dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** UpdateDataModel INSERT — 화면 insertRow()가 회사 ID·분개그룹·사용을 넣는다 */
    int insert(@Param("journalMapId") Long journalMapId, @Param("companyId") Long companyId, @Param("req") JournalMapSaveReq req);

    /** UpdateDataModel UPDATE — 회사 조건을 더했다 */
    int update(@Param("companyId") Long companyId, @Param("req") JournalMapSaveReq req);

    /** UpdateDataModel.deleteModel — 회사 조건을 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS deleteByJournalGroup */
    int deleteByJournalGroup(@Param("companyId") Long companyId, @Param("journalGroup") String journalGroup);

    /** AS-IS insertInitData: 관리자 회사(0)의 그 분개그룹을 대상 회사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("journalGroup") String journalGroup);
}
