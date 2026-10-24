package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.AddTitleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.AddTitleSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmAddTitleMapper {

    /** AS-IS tdm03_add_title.selectByPersonId */
    List<AddTitleRes> selectByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS tdm03_add_title.selectById */
    AddTitleRes selectById(@Param("addTitleId") Long addTitleId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    int insertAddTitle(@Param("addTitleId") Long addTitleId, @Param("companyId") Long companyId,
                       @Param("req") AddTitleSaveReq req, @Param("updName") String updName);

    int updateAddTitle(@Param("companyId") Long companyId, @Param("req") AddTitleSaveReq req, @Param("updName") String updName);

    int deleteAddTitles(@Param("addTitleIds") List<Long> addTitleIds, @Param("companyId") Long companyId);
}
