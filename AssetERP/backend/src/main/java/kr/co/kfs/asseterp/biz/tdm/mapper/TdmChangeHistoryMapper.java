package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ChangeDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChangeHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmChangeHistoryMapper {

    /** AS-IS tdm95_change_history.selectByTargetId */
    List<ChangeHistoryRes> selectByTargetId(@Param("companyId") Long companyId, @Param("targetTable") String targetTable,
                                            @Param("targetId") Long targetId, @Param("changeType") String changeType,
                                            @Param("searchText") String searchText);

    /** AS-IS tdm96_change_detail.selectByChangeHistoryId */
    List<ChangeDetailRes> selectByChangeHistoryId(@Param("companyId") Long companyId, @Param("changeHistoryId") Long changeHistoryId);

    /** AS-IS tdm96_change_detail.createTdmChangeHistory — DB 함수 f_create_tdmChangeHistory(jsonb), 결과 'Y' 또는 오류 문구 */
    String createChangeHistory(@Param("modifyInfo") String modifyInfo);
}
