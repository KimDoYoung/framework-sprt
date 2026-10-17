package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch05RelateIcsRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SchRelateIcsMapper {

    /** AS-IS sch05_relate_ics.selectByInfoId */
    List<Sch05RelateIcsRes> selectByInfoId(@Param("infoId") Long infoId);

    /** AS-IS sch05_relate_ics.selectById — 저장 결과 한 행 */
    Sch05RelateIcsRes selectById(@Param("relateIcsId") Long relateIcsId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Sch05_RelateIcs.modelUpdate → UpdateDataModel(sch05_relate_ics) INSERT */
    int insert(@Param("relateIcsId") Long relateIcsId, @Param("infoId") Long infoId, @Param("icsClassTreeId") Long icsClassTreeId, @Param("deadlineId") Long deadlineId);

    /** AS-IS Sch05_RelateIcs.delete(UpdateDataModel.deleteModel) */
    int deleteById(@Param("relateIcsId") Long relateIcsId);
}
