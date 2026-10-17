package kr.co.kfs.asseterp.biz.ifi.mapper;

import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigParam;
import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigRes;
import kr.co.kfs.asseterp.biz.ifi.dto.IfiConfigSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IfiConfigMapper {

    /** AS-IS ifi90_config.selectByIfType */
    List<IfiConfigRes> selectByIfType(@Param("p") IfiConfigParam param);

    /** AS-IS ifi90_config.selectById (저장 뒤 다시 읽기) */
    IfiConfigRes selectById(@Param("configId") Long configId);

    /** AS-IS ifi90_config.checkConfigId: ifi91_config_api·ifi95_config_file이 쓰는 건수 */
    int checkConfigId(@Param("configId") Long configId);

    /** AS-IS dbConfig.getSeq (= f_create_seq) */
    Long selectNextId();

    int insertConfig(@Param("id") Long id, @Param("r") IfiConfigSaveReq req);

    int updateConfig(@Param("r") IfiConfigSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteConfigs(@Param("ids") List<Long> ids);
}
